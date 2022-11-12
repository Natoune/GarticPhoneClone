import React from 'react';
import styled from "styled-components";

const Div = styled.div`
    max-height: 550px;
    font-size: 70%;
    text-transform: none;
    text-align: left;
    padding: 5%;
    overflow: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;
`;

const H4 = styled.h4`
    font-size: 120%;
    text-decoration: underline;
`;

function Terms() {
	return (
        <>
        <h1 style={{ fontSize: '100%', color: 'var(--button-text)', textDecoration: 'double underline' }}>CONDITIONS D'UTILISATION</h1>
        <Div id="terms" className='top' onScroll={() => {
            if (document.getElementById('terms').scrollTop < 10) {
                document.getElementById('terms').setAttribute('class', document.getElementById('terms').getAttribute('class').toString().replaceAll('top', '').replaceAll('middle', '').replaceAll('bottom', '') + 'top');
            } else if (document.getElementById('terms').scrollTop > 10 && document.getElementById('terms').scrollTop + document.getElementById('terms').offsetHeight + 10 <= document.getElementById('terms').scrollHeight) {
                document.getElementById('terms').setAttribute('class', document.getElementById('terms').getAttribute('class').toString().replaceAll('top', '').replaceAll('middle', '').replaceAll('bottom', '') + 'middle');
            } else {
                document.getElementById('terms').setAttribute('class', document.getElementById('terms').getAttribute('class').toString().replaceAll('top', '').replaceAll('middle', '').replaceAll('bottom', '') + 'bottom');
            }
        }}>
            <a href='/terms.txt'>terms.txt</a>
            <br/>
            <br/>
            <H4>1 - UTILISATION DES DONNÉES</H4><br/>
            <p>En accédant au site Web de Gartic Phone, vous acceptez d'être lié(e) par les présentes conditions d'utilisation, ainsi que par toutes les lois et réglementations applicables, et vous reconnaissez qu'il vous incombe de les respecter.</p><br/>
            <p>Si vous n'êtes pas d'accord, il vous est interdit d'accéder au jeu.</p><br/>
            <p>Les documents contenus dans Gartic Phone sont protégés par les droits d'auteur et les marques commerciales applicables.</p><br/>
            <p>Nous nous réservons le droit de modifier les Conditions générales et les Politiques de confidentialité à tout moment.</p><br/>
            <p>Le fait de continuer à utiliser le jeu après publication des modifications apportées à cette politique sera considéré comme votre acceptation de ces modifications.</p><br/>
            <H4>2 - LICENSE</H4><br/>
            <p style={{ fontSize: '120%', marginLeft: '20px' }}>MIT License</p><br/>
            <p>Copyright (c) 2022 Natoune</p><br/>
            <p>Permission is hereby granted, free of charge, to any person obtaining a copy</p>
            <p>of this software and associated documentation files (the "Software"), to deal</p>
            <p>in the Software without restriction, including without limitation the rights</p>
            <p>to use, copy, modify, merge, publish, distribute, sublicense, and/or sell</p>
            <p>copies of the Software, and to permit persons to whom the Software is</p>
            <p>furnished to do so, subject to the following conditions:</p>
            <br/>
            <p>The above copyright notice and this permission notice shall be included in all</p>
            <p>copies or substantial portions of the Software.</p>
            <br/>
            <p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR</p>
            <p>IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,</p>
            <p>FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE</p>
            <p>AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER</p>
            <p>LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,</p>
            <p>OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE</p>
            <p>SOFTWARE.</p>
            <br/>
            <H4>3 - LIMITES</H4><br/>
            <p>En aucun cas, Gartic Phone ou ses fournisseurs ne peuvent être tenus responsables de dommages. Même si Gartic Phone ou un représentant autorisé du jeu ont été informés oralement ou par écrit de la possibilité de tels dommages. Y compris, mais sans s'y limiter :</p><br/>
            <br/>
            <p>- les dommages dus à la perte de données ou de bénéfices ;</p><br/>
            <p>- les dommages dus à une interruption temporaire ou permanente des services liés à la maintenance ou à des problèmes techniques ;</p><br/>
            <p>- les dommages résultant de l'utilisation ou de l'impossibilité d'utiliser les matériaux de notre jeu.</p><br/>
            <p>Nous n'acceptons aucune responsabilité pour les liens externes envoyés à des tiers. L'inclusion de ces liens ne signifie pas que nous approuvons le matériel ou le contenu de ces sites. Nous ne sommes pas responsables de toute perte, dommage ou inconvénient que vous pourriez subir en jouant à Gartic Phone.</p><br/>
            <H4>4 - LOI APPLICABLE</H4><br/>
            <p>Les présentes conditions générales sont régies et interprétées conformément aux lois de la France, et vous êtes irrévocablement sujet(te) à la compétence exclusive des tribunaux de cet État ou de cet endroit.</p><br/>
            <H4>5 - CONDUITE DES UTILISATEURS</H4><br/>
            <p>Vous devez traiter tous les utilisateurs avec respect et respecter toutes les conditions générales et politiques mises à jour relatives au Gartic Phone. Respectez les autres utilisateurs du jeu. Le langage et les comportements inappropriés sont interdits. Nous ne sommes pas responsables du contenu généré par les utilisateurs comme les surnoms, les phrases et les dessins. Les utilisateurs sont responsables de leurs actions et de toutes les conséquences qui peuvent en découler.</p><br/>
            <H4>CONTACT</H4>
            <p>Pour toute demande, veuillez contacter l'administrateur à l'adresse garticphone@natoune.tk.</p>
        </Div>
        </>
    );
}

export default Terms;